function checkRow(matrix, row) {
  return matrix[row].every((element) => element === matrix[row][0]);
}

function checkColumn(matrix, col) {
  return matrix.every((row) => row[col] === matrix[0][col]);
}

function checkMainDiagonal(matrix) {
  return matrix.every((row, index) => row[index] === matrix[0][0]);
}

function checkAntiDiagonal(matrix) {
  const n = matrix.length;
  return matrix.every((row, index) => row[n - index - 1] === matrix[0][n - 1]);
}

function checkMatrix(matrix) {
  const n = matrix.length;

  for (let row = 0; row < n; row++) {
    if (checkRow(matrix, row)) {
      return { result: true, element: matrix[row][0] };
    }
  }

  for (let col = 0; col < n; col++) {
    if (checkColumn(matrix, col)) {
      return { result: true, element: matrix[0][col] };
    }
  }

  if (checkMainDiagonal(matrix)) {
    return { result: true, element: matrix[0][0] };
  }

  if (checkAntiDiagonal(matrix)) {
    return { result: true, element: matrix[0][n - 1] };
  }

  return { result: false, element: null };
}
module.exports = { checkMatrix };
