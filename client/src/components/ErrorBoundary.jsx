import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }  // eslint-disable-next-line no-unused-vars
    static getDerivedStateFromError(_error) {
        // Met à jour le state pour afficher l'UI de fallback au prochain rendu
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log l'erreur pour le débogage
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    handleReload = () => {
        // Recharge la page pour essayer de récupérer
        window.location.reload();
    };

    handleReset = () => {
        // Remet à zéro l'état d'erreur
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                        <div className="mb-6">
                            <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops ! Une erreur s'est produite</h2>
                            <p className="text-gray-600 mb-4">
                                Ne t'inquiète pas, Lulu va aider à réparer ça ! 🚀
                            </p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={this.handleReset}
                                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                            >
                                Réessayer
                            </button>

                            <button
                                onClick={this.handleReload}
                                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                            >
                                Recharger la page
                            </button>
                        </div>            {/* Affichage de l'erreur en mode développement */}
                        {import.meta.env.DEV && this.state.error && (
                            <details className="mt-6 text-left">
                                <summary className="cursor-pointer text-red-600 font-semibold mb-2">
                                    Détails de l'erreur (dev)
                                </summary>
                                <div className="bg-red-50 border border-red-200 rounded p-3 text-sm">
                                    <p className="font-semibold text-red-700 mb-2">Erreur:</p>
                                    <pre className="text-red-600 text-xs whitespace-pre-wrap mb-3">
                                        {this.state.error && this.state.error.toString()}
                                    </pre>

                                    <p className="font-semibold text-red-700 mb-2">Stack trace:</p>
                                    <pre className="text-red-600 text-xs whitespace-pre-wrap">
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                </div>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
