// lib/fetchResource.ts
export function wrapPromise<T>(promise: Promise<T>) {
  let status = "pending";
  let result: T;
  let suspender = promise.then(
    (res) => {
      status = "success";
      result = res;
    },
    (err) => {
      status = "error";
      result = err;
    }
  );

  return {
    read(): T {
      if (status === "pending") throw suspender;
      if (status === "error") throw result;
      return result!;
    },
  };
}
