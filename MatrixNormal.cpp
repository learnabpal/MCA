#include <iostream>
using namespace std;

void display_matrix(int M[][100], int r, int c)
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

void add_matrices(int A[][100], int B[][100], int R[][100], int r1, int c1, int r2, int c2)
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

void mul_matrices(int A[][100], int B[][100], int R[][100], int r1, int c1, int r2, int c2)
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

void repr_column_major(int M[][100], int C[], int r, int c)
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
}

int main()
{
        int r1, c1, r2, c2;
        int A[r1][c1], B[r2][c2];

        cout << "Enter rows and columns of first matrix" << endl;
        cin >> r1 >> c1;
        cout << "Enter elements of first matrix" << endl;
        for (int i = 0; i < r1; i++)
        {
                for (int j = 0; j < c1; j++)
                {
                        cin >> A[i][j];
                }
        }

        cout << "Enter rows and columns of second matrix" << endl;
        cin >> r2 >> c2;
        cout << "Enter elements of second matrix" << endl;
        for (int i = 0; i < r2; i++)
        {
                for (int j = 0; j < c2; j++)
                {
                        cin >> B[i][j];
                }
        }

        cout << "First matrix:" << endl;
        display_matrix(A, r1, c1);
        cout << "Second matrix:" << endl;
        display_matrix(B, r2, c2);

        int C[r1 * c1], D[r2 * c2];
        cout << "Column-major representation of first matrix:" << endl;
        repr_column_major(A, C, r1, c1);

        cout << "Column-major representation of second matrix:" << endl;
        repr_column_major(B, D, r2, c2);

        int ADD[r1][c1], MUL[r1][c2];

        cout << "Addition of matrices:" << endl;
        add_matrices(A, B, ADD, r1, c1, r2, c2);
        display_matrix(ADD, r1, c1);

        cout << "Multiplication of matrices:" << endl;
        mul_matrices(A, B, MUL, r1, c1, r2, c2);
        display_matrix(MUL, r1, c2);

        return 0;
}