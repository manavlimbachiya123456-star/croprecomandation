"""
SINGLE SOURCE OF TRUTH for all scoring settings (Stage 1 + Stage 2).
Change values here only - no other file hard-codes them.
"""

# ---------- Stage 1 ----------
TOP_N_STAGE1 = 6          # crops returned by Stage 1
# Raw RandomForest probabilities are relative-scaled to 0-100:
#   score = 100 * (p / p_max) ** SCORE_EXPONENT
# Exponent < 1 compresses the gap so lower-ranked crops don't collapse to ~0.
SCORE_EXPONENT = 0.35

# ---------- Stage 2 ----------
TOP_N_FINAL = 3           # crops returned by Stage 2

# Area share bands: (upper_bound_percent_exclusive, adjustment, status label)
# A crop with share s falls in the first band where s < upper_bound.
AREA_BANDS = [
    (10, +10, "Low local cultivation"),
    (20, +5,  "Moderate-low local cultivation"),
    (30, 0,   "Balanced local cultivation"),
    (40, -5,  "Moderately high local cultivation"),
    (50, -10, "High local cultivation"),
]
# Used when share >= last upper bound (50%+)
AREA_OVERFLOW = (-20, "Very high local cultivation")
