def solution(n):
    def generate_prime_string(n):
        """
        Returns a string of consecutive prime numbers with a target
        length of at least n + 5.
        """
        prime_list = []
        # prime density * log(n) approximates the length of the string
        max_num = 20 + int(2.303 * n)
        for num_check in range(2, max_num + 1):
            prime = True
            # no need to check larger factors
            max_factor = int(num_check**0.5 + 1)
            for p in prime_list:
                if num_check % p == 0:
                    prime = False
                    break
                elif p > max_factor:
                    break
            if prime:
                prime_list.append(num_check)
        return "".join([str(p) for p in prime_list])

    return generate_prime_string(n)[n : n + 5]
