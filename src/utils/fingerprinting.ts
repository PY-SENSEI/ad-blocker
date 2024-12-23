// Anti-fingerprinting protections
export function applyFingerprintingProtection() {
  const protections = {
    // Hardware info
    hardwareConcurrency: { value: 2 },
    deviceMemory: { value: 4 },
    
    // Platform info
    platform: { value: 'Win32' },
    userAgent: { value: navigator.userAgent.replace(/\(.*?\)/, '(Windows NT 10.0)') },
    
    // Screen properties
    screenResolution: {
      get: () => [1920, 1080],
      enumerable: true,
      configurable: true
    }
  };

  // Apply protections to navigator object
  Object.defineProperties(navigator, protections);

  // Block canvas fingerprinting
  const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
  HTMLCanvasElement.prototype.toDataURL = function(type) {
    if (type === 'image/png' && this.width === 16 && this.height === 16) {
      return 'data:,';
    }
    return originalToDataURL.apply(this, arguments);
  };

  // Block WebGL fingerprinting
  const getParameter = WebGLRenderingContext.prototype.getParameter;
  WebGLRenderingContext.prototype.getParameter = function(parameter) {
    // Spoof common WebGL parameters
    const spoofedParams = {
      37445: 'Intel Open Source Technology Center', // UNMASKED_VENDOR_WEBGL
      37446: 'Mesa DRI Intel(R) HD Graphics (WSL)' // UNMASKED_RENDERER_WEBGL
    };
    return spoofedParams[parameter] || getParameter.apply(this, arguments);
  };
}