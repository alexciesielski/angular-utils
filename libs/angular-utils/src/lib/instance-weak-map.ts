import { Observable } from 'rxjs';

export function getInstanceWeakMap<T extends Observable<unknown>>(
  defaultValue: () => T
) {
  const instancesMapOfSubjects = new WeakMap<object, Map<string, T>>();

  const getInstanceSubject = (
    instance: object,
    observablePropertyName: string
  ): T => {
    let existingInstanceMap = instancesMapOfSubjects.get(instance);
    if (!existingInstanceMap) {
      const createdSubjectsMap = new Map<string, T>();
      instancesMapOfSubjects.set(instance, createdSubjectsMap);
      existingInstanceMap = createdSubjectsMap;
    }

    let foundSubject = existingInstanceMap.get(observablePropertyName);
    if (!foundSubject) {
      const createdSubject = defaultValue();
      existingInstanceMap.set(observablePropertyName, createdSubject);
      foundSubject = createdSubject;
    }
    return foundSubject;
  };

  return {
    getInstanceSubject,
  };
}
