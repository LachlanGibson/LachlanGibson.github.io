def solution(L):
    L = sorted(L, reverse=True)
    remainder = sum(L) % 3

    if remainder != 0:
        # split L into three lists based on remainder
        L0 = [l for l in L if l % 3 == 0]
        L1 = [l for l in L if l % 3 == 1]
        L2 = [l for l in L if l % 3 == 2]

        if remainder == 1:
            if len(L1) >= 1:
                L1.pop(-1)
            elif len(L2) >= 2:
                L2.pop(-1)
                L2.pop(-1)
            else:
                return 0
        elif remainder == 2:
            if len(L2) >= 1:
                L2.pop(-1)
            elif len(L1) >= 2:
                L1.pop(-1)
                L1.pop(-1)
            else:
                return 0
        L = sorted(L0 + L1 + L2, reverse=True)
        if len(L) == 0:
            return 0
    return int("".join(str(i) for i in L))
