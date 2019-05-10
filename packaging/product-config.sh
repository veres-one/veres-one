#!/usr/bin/env bash

# $config_file will be defined here

genesisnode=`cat $config_file | grep genesisnode | cut -f2 -d=`
