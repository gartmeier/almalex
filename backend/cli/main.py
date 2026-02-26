import click

from cli.cmd.cleanup_chats import cleanup_chats
from cli.cmd.embed import embed_command
from cli.cmd.eval import eval_command
from cli.cmd.fedlex_config import act_status, configure_act
from cli.cmd.load_entscheidsuche import load_entscheidsuche_command
from cli.cmd.load_fedlex import load_fedlex_command
from cli.cmd.shell import shell


@click.group()
def main():
    pass


main.add_command(act_status)
main.add_command(cleanup_chats)
main.add_command(configure_act)
main.add_command(eval_command)
main.add_command(load_fedlex_command)
main.add_command(shell)
main.add_command(embed_command)
main.add_command(load_entscheidsuche_command)

if __name__ == "__main__":
    main()
