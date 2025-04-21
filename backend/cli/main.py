import click

from cli.cmd.load_bge import load_bge
from cli.cmd.load_fedlex import load_fedlex


@click.group()
def main():
    pass


main.add_command(load_bge)
main.add_command(load_fedlex)

if __name__ == "__main__":
    main()
