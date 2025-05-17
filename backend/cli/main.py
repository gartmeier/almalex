import click

from cli.cmd.load_bge import load_bge
from cli.cmd.load_fedlex import load_fedlex
from cli.cmd.prompt import prompt
from cli.cmd.search import search


@click.group()
def main():
    pass


main.add_command(load_bge)
main.add_command(load_fedlex)
main.add_command(prompt)
main.add_command(search)

if __name__ == "__main__":
    main()
