# API

[![CircleCI](https://circleci.com/gh/LetsEatCo/API.svg?style=shield)](https://circleci.com/gh/LetsEatCo/API)
[![Maintainability](https://api.codeclimate.com/v1/badges/3970ddfb6deca962f308/maintainability)](https://codeclimate.com/github/LetsEatCo/API/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/3970ddfb6deca962f308/test_coverage)](https://codeclimate.com/github/LetsEatCo/API/test_coverage)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)
[![Dependabot](https://badgen.net/badge/Dependabot/enabled/green?icon=dependabot)](https://dependabot.com/)

Made with TypeScript + Nest.js.

---

## Getting Started

### Prerequisites

#### Docker

Docker installation is required, see the official [installation docs](https://docs.docker.com/install/).

First step is to build the environment and install Node.js (or anything else…) before rebuilding the complete environment :

```Sh
docker-compose build
```

Afterwards building is only necessary when installing new dependencies.

######  Linux specific

From host, to 'get ownership back' for the generated files, this command finds all files owned by root in the current directory and chown them back to `given_user`:
(Postgres directory will stay own by root, this is normal !)

```bash
find . -user root | xargs sudo chown given_user:given_user
```

#### Environment variables

Environment variables are managed with `.env` file. Add your own configuration to this file according to `.env.sample` file

Everything is set up. You can now start using the application using :

```sh
docker-compose up
```

You can access to the app at : http://localhost

### License
This project is licensed under the GNU General Public License v3.0 License - see the [LICENSE.md](LICENSE.md) file for details

[![FOSSA Status](https://app.fossa.io/api/projects/custom%2B6781%2Fgit%40github.com%3ALetsEatCo%2FAPI.git.svg?type=large)](https://app.fossa.io/projects/custom%2B6781%2Fgit%40github.com%3ALetsEatCo%2FAPI.git?ref=badge_large)
