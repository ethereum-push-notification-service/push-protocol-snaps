
export const popupHelper = (notifs: String[]) => {
  let msg = [] as String[];
  if (notifs.length > 0) {
    notifs.forEach((notif) => {
      let str = `\n🔔` + notif + "\n";
      msg.push(str);
    });
  }
  return msg;
};
