interface LoginData {
    email: string;
    password: string;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: string;
}

interface AuthResponse {
    access_token: string;
    user:{
        id: string;
        name:string;
        email: string;
        role:string
    }
}

class AuthService {
    private readonly baseUrl = 'http://localhost:3000';
    private token: string | null = null;

    constructor() {
        this.token = localStorage.getItem('authToken');
        this.initEventListeners();
    }
private initEventListeners(): void{
    const loginForm = document.getElementById('loginFormElement') as HTMLFormElement;
    loginForm?.addEventListener('submit', this.handleLogin.bind(this))
}
    private async handleLogin(event: Event): Promise<void> {
        event.preventDefault();
        const emailInput =document.getElementById('loginEmail') as HTMLInputElement;
        const passwordInput = document.getElementById('loginPassword') as HTMLInputElement;
        console.log('Login btn clicked');
        console.log(emailInput, passwordInput);
        
        const loginData: LoginData = {
            email: emailInput.value.trim(),
            password: passwordInput.value
        }

        try{
            const response = await this.login(loginData);

            this.token = response.access_token;
            localStorage.setItem('authToken', this.token)

            emailInput.value = '';
            passwordInput.value = '';
        }
        catch(error) {
            console.log(error instanceof Error ? error.message: 'Login failed', 'error');
            
        }
    }

    private async login(data: LoginData): Promise<AuthResponse> {
        const response = await fetch(`${this.baseUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(data)
        });

        if(!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        return response.json();
    }
}