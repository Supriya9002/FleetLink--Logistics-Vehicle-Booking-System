import { pathToFileURL } from 'url';
import { register } from 'module';

// Enable ES modules for .js files
export async function resolve(specifier, context, nextResolve) {
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  return nextLoad(url, context);
}