import click

from cli.cmd.backfill_act_source_url import backfill_source_url
from cli.cmd.backfill_decision_source_url import backfill_decision_source_url
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
main.add_command(backfill_decision_source_url)
main.add_command(backfill_source_url)
main.add_command(configure_act)
main.add_command(eval_command)
main.add_command(load_fedlex_command)
main.add_command(shell)
main.add_command(embed_command)
main.add_command(load_entscheidsuche_command)

if __name__ == "__main__":
    main()
