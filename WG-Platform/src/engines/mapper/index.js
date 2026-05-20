import { getValueByPath, setValueByPath } from '../../utils/valueMapper.js';

export function mapRecord(source = {}, mapping = {}) {
  return Object.entries(mapping).reduce((target, [targetPath, sourcePath]) => {
    const value =
      typeof sourcePath === 'function'
        ? sourcePath(source)
        : getValueByPath(source, sourcePath);

    return setValueByPath(target, targetPath, value);
  }, {});
}

export function createMapper(mapping = {}) {
  return (source) => mapRecord(source, mapping);
}
