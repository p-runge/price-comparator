# Data

The data used in this directory was being fetched once. It still needs some manual work done.

The core file is the cards_short_map.csv.
All remaining shorts starting with "?" need to manually be fixed.

As soon as that file is done, execute:

```bash
pnpx csvtojson data/cards_short_map.csv > public/cards.json
```

This generates the json file, that can then be used in the code.

As soon as this is done, the rest of the files in that dir can be deleted.
