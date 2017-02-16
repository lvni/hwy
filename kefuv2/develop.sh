#!/bin/sh
if [ ! -d output ]; then
  mkdir output
fi
cp -rf im.html  easemob.js transfer.html static/ output/
