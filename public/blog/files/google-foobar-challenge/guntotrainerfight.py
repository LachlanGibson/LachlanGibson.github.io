def solution(dimensions, your_position, trainer_position, distance):
    def norm(v):
        # Euclidean norm
        return sum(x**2 for x in v) ** 0.5

    def gcd(a, b):
        # Euclidean algorithm to find the greatest common divisor
        # a and b should be positive integers
        while b != 0:
            a, b = b, a % b
        return a

    def get_direction(v):
        # Rescales vector v by greatest common divisor
        f = gcd(abs(v[0]), abs(v[1]))
        return tuple(x // f for x in v)

    def repeat(z, z_dim):
        # Generates a list of coordinates that show all reflections along a
        # partcular dimension.
        values = [-z, z]
        for i in range(2, distance // z_dim + 3, 2):
            values.append(i * z_dim - z)
            values.append(i * z_dim + z)
            values = [-i * z_dim - z, z - i * z_dim] + values
        return values

    # Compute the directions and distances to shoot yourself
    y_reflects = {}
    for x in repeat(your_position[0], dimensions[0]):
        for y in repeat(your_position[1], dimensions[1]):
            p = (x - your_position[0], y - your_position[1])
            n = norm(p)
            if p != (0, 0) and n <= distance:
                direction = get_direction(p)
                if direction in y_reflects:
                    y_reflects[direction] = min(y_reflects[direction], n)
                else:
                    y_reflects[direction] = n

    # Compute the directions and distances to shoot the target
    t_reflects = {}
    for x in repeat(trainer_position[0], dimensions[0]):
        for y in repeat(trainer_position[1], dimensions[1]):
            p = (x - your_position[0], y - your_position[1])
            n = norm(p)
            if p != (0, 0) and n <= distance:
                direction = get_direction(p)
                if direction in t_reflects:
                    t_reflects[direction] = min(t_reflects[direction], n)
                else:
                    t_reflects[direction] = n

    # find directions which would hit yourself before the target
    delete = []
    for direction in t_reflects:
        if direction in y_reflects:
            if y_reflects[direction] < t_reflects[direction]:
                delete.append(direction)

    # delete those directions
    for direction in delete:
        del t_reflects[direction]

    num_dir = len(t_reflects)
    return num_dir
