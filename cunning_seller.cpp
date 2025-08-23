#include <iostream>
using namespace std;

long long solve(long long n) {
    long long cost = 0;
    
    while (n > 0) {
        // Encontrar a maior potência de 3 que não excede n
        long long power = 1;
        int x = 0;
        
        while (power * 3 <= n) {
            power *= 3;
            x++;
        }
        
        // Calcular quantos negócios deste tipo podemos fazer
        long long deals = n / power;
        
        // Custo por negócio: 3^(x+1) + x * 3^(x-1)
        long long cost_per_deal;
        if (x == 0) {
            cost_per_deal = 3; // 3^1 + 0 * 3^(-1) = 3
        } else {
            cost_per_deal = 3 * power + x * (power / 3);
        }
        
        cost += deals * cost_per_deal;
        n -= deals * power;
    }
    
    return cost;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    int t;
    cin >> t;
    
    while (t--) {
        long long n;
        cin >> n;
        cout << solve(n) << "\n";
    }
    
    return 0;
}
