const {Command} = require('tbrex');

class HelpCommand extends Command {

  async exec(args, out) {

    if (args.keys) {
      out.send(this.keysHelp());
    }
    else if (args.storage) {
      out.send(this.storageHelp());
    }
    else if (args.passwords) {
      out.send(this.passwordsHelp());
    }
    else {
      out.send(this.basicHelp());
    }

  return this.SUCCESS;
  }

  basicHelp() { 
    return `
  HiPS - Hidden in Plain Sight

  This is a command line tool that will help manage your passwords, storing them using RSA cryptography.
  The basic usage is:

  $ hips <command> [...arguments]

  To have a list of available commands, just run it without passing any arguments.
  The help command displays this message and also have some subsections:

  "hips help --keys" will show support on how to create and manage encryption keys
  "hips help --storage" will help you configure the storage options
  "hips help --passwords" will display a help message on managing your passwords
  `}

  keysHelp() {
    return `
  HiPS uses RSA cryptography to protect the passwords.
  You can check if you have keys configured by trying to run "hips get-key".
  This is a command that displays your public key. If you don't see any keys, you might
  still not have one.

  To create the your RSA key-pair, run the command "hips create-key". After a few seconds
  you will see the keys were created, and now the command "hips get-key" will display the public
  key successfully.

  Notice that if you run "hips create-key" and you already have keys configured, it will warn
  you that you need to 'force update' the keys by running "hips create-key --force".
  This will then replace the old keys, therefore MAKING THE STORED PASSWORDS UNACCESSIBLE.

  You can see the private key as well, by running "hips get-key --private".
  Be extra cautious with this private key, as it is the key that is used to decrypt your passwords.

  As a final note, if you have a backup of the keys and want to restore, just place them as text files
  in the expected locations, that are:
  
  $HOME/.hips/key for the private key
  $HOME/.hips/key_pub for the public key
  `
  }

  storageHelp() {
    return `
  HiPS provides different ways to store the saved passwords.

  By default it stores in your local machine, in your home directory, in a file called hips_passwords.
  You can change it by running "hips config" and answering the prompt.

  There you will find the following options for storage:

  DiskStorage: The default one, this will save in a local file, and in the prompt you can change the directory
  that will be used.

  GithubStorage: This option will save the encrypted passwords as a private Gist in your github account. The
  prompts will ask for your github credentials and will set everything up.

  Just remember that, even for remote storage, the data will only be accessible if you still have the encryption
  keys that are in your local machine. If you want to be safe even in case you local machine breaks, remember to
  backup them using "hips get-key" and "hips get-key --private", but BE EXTRA CAREFUL WITH THE KEYS.
  `
  }

  passwordsHelp() {
    return `
    HiPS' main functionality is to manage your passwords, and in this help topic you can see how to use it.

    Every password has a name, and can have a description and some parameters. The user will never input
    the password, but HiPS will generate them instead, based on the parameters.

    To create a password and store it run the command:

    $ hips create --name <foo> --description <bar> [--length --exclude]

    With this command you can also set the length of the password and even prohibit some characters. It's
    recommended that you use this options only if the target service has some input limitations for the
    passwords.

    You can run "hips get <foo>" to retrieve the generated password. This command will copy it to the clipboard.
    If you run "hips get <foo> --display" it will be echoed in the console instead.

    There is also a "hips list" command, to see the names of all the saved passwords, together with their 
    respective descriptions.

    You can remove a saved password with the "hips remove <foo>" command.

    Finally, there is an option to recreate any saved password. This command accepts either a list of names
    or the --all flag, and will discard the old passwords and replace with new ones using the same parameters.
    `
  }

  describe() {
    return 'Displays a help screen'
  }
}

module.exports = HelpCommand;