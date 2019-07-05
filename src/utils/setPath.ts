/*
 * setPath - Oppdater hashmaps ved å anngi sti som en streng og verdi.
 *
 *      F.eks. setPath("familie/sivilstatus/barn", {navn: 'Doffen'})
 *
 * Oppretter element i object ut fra sti hvis det ikke finnes.
 *
 * setPath( {}, 'familie/sivilstatus/status/barn', {navn: "Doffen"});
 *  => { familie: { sivilstatus: { status: {barn: {navn: 'Doffen' } } } }
 *
 * setPath( {}, 'familie/barn/0', {navn: "Doffen"})
 *  => {familie: {barn : [{navn: "Doffen"}]
 */
export const setPath = (obj: any, path: string, value: any): any => {
    obj = typeof obj === 'object' ? obj : {};
    const keys = Array.isArray(path) ? path : path.split('/');
    let curStep = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!curStep[key] && !Object.prototype.hasOwnProperty.call(curStep, key)){
            const nextKey = keys[i+1];
            const useArray = /^\+?(0|[1-9]\d*)$/.test(nextKey);
            curStep[key] = useArray ? [] : {};
        }
        curStep = curStep[key];
    }
    const finalStep = keys[keys.length - 1];
    curStep[finalStep] = value;
    return obj;
};

