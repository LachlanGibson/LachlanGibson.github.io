def solution(str_n):
    def f(n):
        if n <= 6:
            return [0, 1, 3, 7, 12, 19, 27][n]
        n2 = floorsqrt(2 * n * n)
        n3 = n2 - n
        return n2 * (n2 + 1) // 2 - n3 * (n3 + 1) - f(n3)

    return str(f(int(str_n)))


def floorsqrt(k):
    e0, e = 4 * 10 ** (len(str(k)) // 2), k
    while e0 < e:
        e0, e = (e0 + k // e0) // 2, e0
    return e
