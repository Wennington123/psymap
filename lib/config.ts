import Constants from 'expo-constants';

/**
 * true quando o app foi buildado com FLAVOR=foss (versão F-Droid, sem Firebase).
 * false no build normal da Play. Usado para esconder login/ranking e ativar Metas.
 */
export const IS_FOSS: boolean = Constants.expoConfig?.extra?.flavor === 'foss';
