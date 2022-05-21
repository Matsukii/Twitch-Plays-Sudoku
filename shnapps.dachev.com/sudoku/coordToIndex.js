/**
 * @description convert coordinates to index
 * table is linear,
 * for example:
 * A1(first) = 0,
 * A1(second row, first column) = 9
 * I9(last) = 80
 * 
 * 
 * @param {String} coord        column+row position, ex. A1, B5 
 * @param {Number} rowCellCount number of columns in the table
 * that will be multiplied to get the row
 * @returns {Number} index/position as integer
 */
function coordToIndex(coord, rowCellCount = 26) {
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    coord = coord.split("");
    return ((parseInt(coord[1]) - 1) * rowCellCount) + alphabet.lastIndexOf(coord[0].toLocaleUpperCase());
}