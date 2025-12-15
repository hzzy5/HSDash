//Hier speichert man die Daten eines Levels als eine Art "Map". Jedes Zeichen steht für ein Element, was später gerendert wird.

export var levels = [
    {
        name: "level01",
        //ggf. weitere Eigenschaften
        map: [
            "                                                                                                                                                                        ",
            "                                                                                                                                                                        ",
            "                                                                                                                                                                        ",
            "                                                                                                                                                                        ",
            "                                                                                                                                                                        ",
            "                                                                                                                                                                        ",
            "                                                                                                                                                                        ",
            "                                                                                                                                                                        ",
            "                                                                                                                                                                        ",
            "                                        o o o                                                                                                                           ",
            "                                                                                                                                                                        ",
            "                         xxxx          xxxxxx                                                                                                                           ",
            "                         xxxx                                      xxxx                                                                                                 ",
            "                                                               xxxx                                                                                                     ",
            "                                                                                                                                                                        ",
            "                                                                                                                                                                        ",
            "                      xxxx                                                                          x                                                                   ",
            "                  xxxx                                                                               x                                                                  ",
            "                                                                                                      xxxxxxxxxxxx                                                      ",
            "                                          o                                                       x                                                                     ",
            "                                        o   o                                                      x                                                                    ",
            "       xx                      x      o xxxx  o                                                       x                                                                 ",
            "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
            "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
            "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
            "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        ]
    }

];

/*  Daraus wird später ein Tile-Objekt erzeugt.
    Ein Tile ist ein Block des Levels.
    const TILE_SIZE = 32; beschreibt einen Block im Level, der 32x32 groß ist.
    Liegt ein Tile in der fünften Spalte und dritten Zeile, platzieren wir ihn dort:
    x = 5 * TILE_SIZE; y = 3 * TILE_SIZE;

    Die Map ist das ganze Tilesheet.
*/