import nanoid as nanoid_package


def nanoid() -> str:
    return nanoid_package.generate(
        alphabet="0123456789abcdefghijklmnopqrstuvwxyz",
        size=12,
    )
