import click

from cli.cmd.cleanup_chats import cleanup_chats
from cli.cmd.fix_fedlex_urls import fix_fedlex_urls
from cli.cmd.load_fedlex import load_fedlex
from cli.cmd.shell import shell
from cli.cmd.sync_all import sync_all
from cli.cmd.sync_bge import sync_bge_command
from cli.cmd.sync_fedlex import sync_fedlex_command


@click.group()
def main():
    pass


main.add_command(cleanup_chats)
main.add_command(fix_fedlex_urls)
main.add_command(load_fedlex)
main.add_command(shell)
main.add_command(sync_all)
main.add_command(sync_bge_command)
main.add_command(sync_fedlex_command)

if __name__ == "__main__":
    main()
