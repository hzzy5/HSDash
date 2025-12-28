//Hier speichert man die Daten eines Levels als eine Art "Map". Jedes Zeichen steht für ein Element, was später gerendert wird.
//Jedes Level muss 48x25 Pixel groß sein. -->Lieber 26 Zeilen, damit keine Ränder entstehen.
export var levels = [
    {
        name: "level01",
        //ggf. weitere Eigenschaften
        map: [


            "                                                                                                                                                                                                                  ",
            "                                                                                                                                                                                                                  ",
            "                                                                                                                                                                                                                  ",
            "                                                                                                                                                                                                                  ",
            "                                                                                                                                                                                                                  ",
            "                                                                                                                                                                                                                  ",
            "                                                                                                                                                                                                                  ",
            "                                                                                                                                                                                                                  ",
            "                                        o o o                                                                                                                                                                     ",
            "                          l                                                                                                                                                                                       ",
            "                         xxxx          xxxxxx                                                                                                                                                                     ",
            "                         xxxx                                      xxxx                                                                                                                                           ",
            "                                                               xxxx                                                          l                                                                                    ",
            "                                                                                                                                                                                                                  ",
            "                                                                                                                         o o    o o                                                                               ",
            "                      xxxx                                                                                                                                                                                        ",
            "                  xxxx                                                         o              oooo                                                                                                                ",
            "                                                                                                                       o o        o o                                                                             ",
            "                                          o                                                                                                                                                                       ",
            "                                        o   o                        o                                                                                                                                            ",
            "                                      o       o                               o           o                    l                                                                                                  ",
            "----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- ",
            "----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- ",
            "----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- ",
            "                                                                                                                                                                                                                  ",
            "                                                                                                                                                                                                                  ",
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