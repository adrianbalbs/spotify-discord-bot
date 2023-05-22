export function generateRandomString(length: number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let res = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    res += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return res;
}

export function wait(time: number) {
  return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), time);
  });
}