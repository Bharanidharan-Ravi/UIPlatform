export function isPlatformDebugEnabled(scope) {

    if (typeof window === "undefined")
        return false;

    if (window.WG_DEBUG !== true)
        return false;

    if (!scope)
        return true;

    const scopes = window.WG_DEBUG_SCOPES || [];

    return scopes.includes(scope);
}

// export function isPlatformDebugEnabled() {
//   return typeof window !== 'undefined' && window.WG_DEBUG === true;
// }
