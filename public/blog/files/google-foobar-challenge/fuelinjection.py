def solution(n):
    n = long(n)
    count = 0
    while n > 1:
        count += 1
        n1, r1 = divmod(n, 2)
        n2, r2 = divmod(n1, 2)
        if r1 == 0:
            n = n1
        elif (r2 != r1) or n == 3:
            n -= 1
        else:
            n += 1
    return count
