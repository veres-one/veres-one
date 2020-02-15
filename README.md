# Veres One

A blockchain for acquiring and managing decentralized identifiers.

The Veres One Project envisions a world where people and organizations
control their identifiers and their identity data. The Veres One
Blockchain is a fit-for-purpose blockchain optimized for identity on the
Web. The network ecosystem is designed to be self-sufficient through the
use of an innovative operational and funding model. The operational model
ensures openness, prevents attacks against the network, and financially
rewards individuals and organizations that choose to run software to
ensure the security of the network.

Human dignity demands that every individual be able to participate equally
in our increasingly digital society. That means everyone deserves the ability
create and administer unique, globally resolvable identifiers. For that
reason, the network is global and open to the public; anyone may participate.

You can learn more about this project at the
[Veres One Website](https://veres.one/).

Technical details about the blockchain can be found in the
[Veres One DID Method Specification](https://w3c-ccg.github.io/didm-veres-one/).

# Requirements

* Linux (Debian 10+, Ubuntu 18.04+)
* Node 12.11+
* MongoDB (3.6+)
* Redis (4+)

# Evaluation Quickstart

You can create DIDs to the Veres One Testnet by using the [did-client][]:

```
git clone https://github.com/digitalbazaar/did-cli.git
cd did-cli
npm install
./did generate --register
```

# Developer Quickstart

Setting up a Veres One development environment is fairly easy and consists of
the following steps:

1. Modify your `/etc/hosts` file.
2. Install Git, Node, MongoDB, and Redis.
3. Setup the Veres One development environment.

Detailed instructions can be found below:

Make sure to add the following hostnames to your `/etc/hosts` file:

```
127.0.0.1  localhost node-1.veres.one.local node-2.veres.one.local \
           node-3.veres.one.local node-4.veres.one.local
```

The `\` and line break above is for readability purposes. Every
`*.veres.one.local` should be on the same line as 127.0.0.1.

```
git clone https://github.com/veres-one/veres-one.git
cd veres-one
npm install
node dev.js
```

You can write DIDs to the development blockchain by using the [did-client][]:

```
git clone https://github.com/digitalbazaar/did-cli.git
cd did-cli
npm install
./did -m dev generate --register
```

If you want to run a minimum network with electors, you will have to run
4 nodes:

```
cd veres-one
node node-1 &
node node-2 &
node node-3 &
node node-4 &
```

When you create a DID, you should see all peers vote and synchronize to the
same block.

## Issue Tracker

All bugs, suggestions, requests, and code issues are tracked on the
[Veres One Issue Tracker](https://github.com/veres-one/veres-one/issues).

[did-client]: https://github.com/digitalbazaar/did-client
