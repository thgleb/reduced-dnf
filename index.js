/**
 * It converts a decimal to binary and
 * adds insignificant zeros considering
 * @length.
 *
 * @param int dec
 * @param int length
 *
 * @return string 
 */
function dec2bin(dec, length) {
  let bin = (dec >>> 0).toString(2);

  if (length != undefined) {
    let cnt = length - bin.length;
    
    if (cnt > 0) {
      bin = "0".repeat(cnt) + bin;
    }
  }

  return bin;
}

/**
 * It calculates the difference between two
 * strings of the same length and returns
 * a general pattern.
 *
 * @param string a
 * @param string b
 *
 * @param Object { tpl: String, cnt: int }
 */
function diff(a, b) {
  let diffCount = 0;

  let values = a.split("").map((v, i) => {
    if (b[i] !== v) {
      diffCount++;
      return "-";
    }

    return v;
  });

  return { tpl: values.join(""), cnt: diffCount };
}

/**
 * It checks for equality of two maps
 *
 * @param Map map1
 * @param Map map2
 *
 * @return bool
 */
Map.equals = function(map1, map2) {
  if (map1.size !== map2.size)
    return false;

  for (let [key, val] of map1) {
    let testVal = map2.get(key);

    if (testVal !== val || (testVal === undefined && !map2.has(key)))
      return false;
  }

  return true;
}

/**
 * Algorithm for finding a reduced disjunctive normal form
 *
 * @param array args    Function arguments
 * @param array points  Points where function takes true-defined values
 *
 * @return Object { columns, F, L } Columns are for the patterns
 *                                  F is for gotten function
 *                                  L is for its complexity      
 */
function reducedDNF(args, points) {
  let columns = [];

  // Creating a first column
  columns.push(new Map());

  for (let i = 0; i < points.length; i++)
    columns[0].set(dec2bin(points[i], args.length), false);

  // Algorithm
  let columnIndex = 0;

  while (1) {
    let column = columns[columnIndex];

    // Create next column
    columns.push(new Map());

    // Compare each element with each within one column
    for (let [key1, value1] of column) {
      for (let [key2, value2] of column) {
        let d = diff(key1, key2);

        if (d.cnt !== 1)
          continue;

        columns[columnIndex].set(key1, true);
        columns[columnIndex + 1].set(d.tpl, false);
      }
    }

    // If some elements weren't combined together,
    // move 'em to the next column
    for (let [key, value] of columns[columnIndex])
      if (value === false)
        columns[columnIndex + 1].set(key, false);

    // Check if the algorithm finished
    if (Map.equals(columns[columnIndex], columns[columnIndex + 1])) {
      columns.pop();
      break;
    }

    columnIndex++;
  }

  // Form the function and its complexity
  let F = [],
    L = 0;

  for (let tpl of columns[columns.length - 1].keys()) {
    let f = "";

    tpl.split("").forEach((d, i) => {
      d = parseInt(d);

      if (isNaN(d))
        return;

      f += (d === 1 ? "" : "¬") + args[i];
        L++;
    });

    F.push(f);
  }

  F = F.join(" + ");

  // Form better columns for output
  let c = [];
  columns.forEach(column => c.push(Array.from(column.keys())));

  return { columns: c, F, L };
}

module.exports = reducedDNF;