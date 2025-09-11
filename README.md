# portal

## about

`mikrofabriken_portal` contains the code for the mikrofabriken member portal.

available at [portal.mikrofabriken.se](https://portal.mikrofabriken.se)

## contributing

contributions are welcome.

if you are interested in contributing, please contact me on Slack.

### developing locally

#### 1. clone the `mikrofabriken_portal` and `ufData` repos

```bash
git clone git@github.com:ollema/mikrofabriken_portal.git
git clone git@gitlab.mikrofabriken.se:mikrofabriken/ufdata.git
```

#### 2. install dependencies

```bash
cd mikrofabriken_portal
npm install -g pnpm
pnpm install
```

#### 3. configure environment variables

use `.env.example` as a template for your `.env` file.

#### 4. create a new branch to work on your changes:

```bash
git switch -c <branch-name>
```

#### 5. start the development server

```bash
pnpm dev
```

#### 6. commit your changes

```bash
git add .
git commit -m "<commit-message>"
```

#### 7. push your changes to the remote repository

```bash
git push -u origin <branch-name>
```

#### 8. create a pull request

see [this guide](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) for more information.

wait for your pull request to be reviewed and merged. congratulations, you have now successfully contributed to the portal!

#### 9. (optional) delete your branch

```bash
git switch main
git branch -d <branch-name>
```
