"""
Small RandomForest classifier written in pure numpy (used because scikit-learn/scipy
can be blocked by some Windows Application Control policies).
Gini CART trees, bootstrap sampling, random feature subsets, averaged leaf probabilities.
"""
import numpy as np

class Forest:
    def __init__(self, n_trees=60, max_depth=12, min_leaf=3, seed=42):
        self.n_trees, self.max_depth, self.min_leaf, self.seed = n_trees, max_depth, min_leaf, seed
        self.trees, self.classes = [], []

    # ---------- training ----------
    def fit(self, X, y, classes):
        rng = np.random.default_rng(self.seed)
        self.classes = list(classes)
        self.trees = []
        n, d = X.shape
        mf = max(1, int(np.sqrt(d)))
        for _ in range(self.n_trees):
            idx = rng.integers(0, n, n)                 # bootstrap sample
            self.trees.append(self._build(X[idx], y[idx], rng, mf))
        return self

    def _build(self, X, y, rng, mf):
        C, ml = len(self.classes), self.min_leaf
        feat, thr, left, right, val = [], [], [], [], []

        def node(ids, depth):
            i = len(feat)
            feat.append(-1); thr.append(0.0); left.append(-1); right.append(-1)
            counts = np.bincount(y[ids], minlength=C).astype(float)
            val.append(counts / counts.sum())
            if depth >= self.max_depth or len(ids) < 2 * ml or (counts > 0).sum() == 1:
                return i
            Xs, Y, best = X[ids], np.eye(C)[y[ids]], None
            for f in rng.choice(X.shape[1], mf, replace=False):
                col = Xs[:, f]
                u = np.unique(col)
                if len(u) < 2:
                    continue
                cand = (u[:-1] + u[1:]) / 2 if len(u) <= 17 else np.unique(np.quantile(col, np.linspace(0.05, 0.95, 16)))
                lc = (col[:, None] <= cand[None, :]).astype(float).T @ Y     # left class counts per threshold
                rc = counts - lc
                ln, rn = lc.sum(1), rc.sum(1)
                ok = (ln >= ml) & (rn >= ml)
                if not ok.any():
                    continue
                gl = 1 - ((lc / np.maximum(ln, 1)[:, None]) ** 2).sum(1)      # Gini impurity
                gr = 1 - ((rc / np.maximum(rn, 1)[:, None]) ** 2).sum(1)
                score = (ln * gl + rn * gr) / len(ids)
                score[~ok] = np.inf
                k = int(score.argmin())
                if best is None or score[k] < best[0]:
                    best = (score[k], f, cand[k])
            if best is None:
                return i
            _, f, t = best
            feat[i], thr[i] = int(f), float(t)
            m = Xs[:, f] <= t
            left[i] = node(ids[m], depth + 1)
            right[i] = node(ids[~m], depth + 1)
            return i

        node(np.arange(len(y)), 0)
        return (np.array(feat, np.int16), np.array(thr, np.float32), np.array(left, np.int32),
                np.array(right, np.int32), np.array(val, np.float32))

    # ---------- inference ----------
    def predict_proba(self, x):
        total = np.zeros(len(self.classes))
        for f, t, l, r, v in self.trees:
            i = 0
            while f[i] >= 0:
                i = l[i] if x[f[i]] <= t[i] else r[i]
            total += v[i]
        return total / len(self.trees)

    # ---------- persistence (.npz, no pickle) ----------
    def save(self, path):
        parts = list(zip(*self.trees))
        offs = np.cumsum([0] + [len(t[0]) for t in self.trees])
        np.savez_compressed(path, classes=np.array(self.classes), offsets=offs,
                            feat=np.concatenate(parts[0]), thr=np.concatenate(parts[1]),
                            left=np.concatenate(parts[2]), right=np.concatenate(parts[3]),
                            val=np.concatenate(parts[4]))

    @classmethod
    def load(cls, path):
        z = np.load(path, allow_pickle=False)
        m = cls()
        m.classes = [str(c) for c in z["classes"]]
        o = z["offsets"]
        m.trees = [tuple(z[k][o[i]:o[i + 1]] for k in ("feat", "thr", "left", "right", "val"))
                   for i in range(len(o) - 1)]
        return m
