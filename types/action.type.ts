export type action = {
    type: 'INICIAR_SESION' | 'CERRAR_SESION';
    usuario: object;
    autenticado: boolean;
};