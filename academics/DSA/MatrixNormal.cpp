#include <iostream>
using namespace std;

const int MAX = 10;

void input_matrix(int M[][MAX], int& r, int& c, int matrix_number)
{
    cout << "Enter rows and columns of matrix " << matrix_number << " (maximum " << MAX << "):" << endl;
    cin >> r >> c;
    while (r < 1 || r > MAX || c < 1 || c > MAX)
    {
        cout << "Rows and columns must be between 1 and " << MAX << ". Enter again:" << endl;
        cin >> r >> c;
    }

    cout << "Enter elements of matrix " << matrix_number << endl;
    for (int i = 0; i < r; i++)
    {
        for (int j = 0; j < c; j++)
        {
            cin >> M[i][j];
        }
    }
}

void display_matrix(int M[][MAX], int r, int c)
{
        for (int i = 0; i < r; i++)
        {
                for (int j = 0; j < c; j++)
                {
                        cout << M[i][j] << "\t";
                }
                cout << endl;
        }
}

void add_matrices(int A[][MAX], int B[][MAX], int R[][MAX], int r1, int c1, int r2, int c2)
{
        bool valid = r1 == r2 && c1 == c2;
        if (valid)
        {
                for (int row = 0; row < r1; row++)
                {
                        for (int col = 0; col < c1; col++)
                        {
                                R[row][col] = A[row][col] + B[row][col];
                        }
                }
        }
        else
        {
                cout << "Matrices cannot be added" << endl;
        }
}

void mul_matrices(int A[][MAX], int B[][MAX], int R[][MAX], int r1, int c1, int r2, int c2)
{
        bool valid = c1 == r2;
        if (valid)
        {
                for (int row = 0; row < r1; row++)
                {
                        for (int col = 0; col < c2; col++)
                        {
                                R[row][col] = 0;
                                for (int x = 0; x < c1; x++)
                                {
                                        R[row][col] += A[row][x] * B[x][col];
                                }
                        }
                }
        }
        else
        {
                cout << "Matrices cannot be multiplied" << endl;
        }
}

void repr_column_major(int M[][MAX], int C[], int r, int c)
{
        int ix = 0;
        for (int i = 0; i < c; i++)
        {
                for (int j = 0; j < r; j++)
                {
                        C[ix++] = M[j][i];
                }
        }
        for (int i = 0; i < ix; i++)
        {
                cout << C[i] << "\t";
        }
        cout << endl;
}

int main()
{
        int r1, c1, r2, c2;
        int A[MAX][MAX], B[MAX][MAX];
        int ADD[MAX][MAX], MUL[MAX][MAX];
        int C[MAX * MAX], D[MAX * MAX];

        input_matrix(A, r1, c1, 1);
        input_matrix(B, r2, c2, 2);

        cout << "First matrix:" << endl;
        display_matrix(A, r1, c1);

        cout << "Second matrix:" << endl;
        display_matrix(B, r2, c2);

        cout << "Column-major representation of first matrix:" << endl;
        repr_column_major(A, C, r1, c1);

        cout << "Column-major representation of second matrix:" << endl;
        repr_column_major(B, D, r2, c2);

        cout << "Addition of matrices:" << endl;
        add_matrices(A, B, ADD, r1, c1, r2, c2);
        if (r1 == r2 && c1 == c2)
        {
                display_matrix(ADD, r1, c1);
        }

        cout << "Multiplication of matrices:" << endl;
        mul_matrices(A, B, MUL, r1, c1, r2, c2);
        if (c1 == r2)
        {
                display_matrix(MUL, r1, c2);
        }

        return 0;
}