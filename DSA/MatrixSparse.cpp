#include <iostream>
using namespace std;

int zero_counts(int M[][100], int r, int c)
{
        int zeroes = 0;
        for (int i = 0; i < r; i++)
        {
                for (int j = 0; j < c; j++)
                {
                        if (M[i][j] == 0)
                        {
                                zeroes++;
                        }
                }
        }
        return zeroes;
}

bool is_sparse(int M[][100], int r, int c)
{
        return zero_counts(M, r, c) > (r * c) / 2;
}

void represent_sparse(int M[][100], int r, int c)
{
        int rows = 3, cols = (r * c) - zero_counts(M, r, c);
        int R[rows][cols];
        int cx = 0;
        for (int i = 0; i < r; i++)
        {
                for (int j = 0; j < c; j++)
                {
                        if (M[i][j] != 0)
                        {
                                R[0][cx] = M[i][j];
                                R[1][cx] = i;
                                R[2][cx] = j;
                                cx++;
                        }
                }
        }

        for (int i = 0; i < rows; i++)
        {
                for (int j = 0; j < cols; j++)
                {
                        cout << R[i][j] << "\t";
                }
                cout << endl;
        }
}

int main()
{
        int r, c;
        int M[r][c];

        cout << "Enter rows and columns of matrix: ";
        cin >> r >> c;
        cout << "Enter elements of matrix: " << endl;
        for (int i = 0; i < r; i++)
        {
                for (int j = 0; j < c; j++)
                {
                        cin >> M[i][j];
                }
        }

        if (is_sparse(M, r, c))
        {
                cout << "Matrix is sparse" << endl;
        }
        else
        {
                cout << "Matrix is not sparse" << endl;
        }

        cout << "Representing sparse matrix: " << endl;
        represent_sparse(M, r, c);

        return 0;
}
