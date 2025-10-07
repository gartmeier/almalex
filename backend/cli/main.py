import click

from cli.cmd.cleanup_chats import cleanup_chats
from cli.cmd.fix_fedlex_urls import fix_fedlex_urls
from cli.cmd.load_bge import load_bge
from cli.cmd.load_fedlex import load_fedlex
from cli.cmd.shell import shell
from cli.cmd.sync_fedlex import sync_fedlex


@click.group()
def main():
    pass


main.add_command(cleanup_chats)
main.add_command(fix_fedlex_urls)
main.add_command(load_bge)
main.add_command(load_fedlex)
main.add_command(shell)
main.add_command(sync_fedlex)

if __name__ == "__main__":
    main()
