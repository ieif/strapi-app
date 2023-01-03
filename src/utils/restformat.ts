/**
 * 格式化输出restful 数据
 * @param data
 */
export default function transformRest(data: any) {
   data = data.data;
   if (data instanceof Array) {
      let list: any = [];
      for (let item of data) {
         let v = transformRestItem(item);
         isNull(v) || list.push(v);
      }
      return {
         data: list,
      };
   } else {
      let ret: any = transformRestItem(data);
      return {
         data: ret,
      };
   }
}

function transformRestItem(data) {
   if (isNull(data)) return;
   if (isUnit(data)) return data;
   if (data instanceof Array) {
      let list: any[] = [];
      for (let item of data) {
         list.push(transformRestItem(item));
      }
      return list;
   } else {
      let ret: any = {};
      let hasId = false;
      if (!isNull(data.id)) {
         ret.id = data.id;
         hasId = true;
      }
      for (let key in data.attributes) {
         if (/^__/i.test(key)) continue;
         let attr = data.attributes[key];
         if (!attr) continue;
         let xf = typeof attr;
         if (["string", "number", "boolean"].includes(xf)) {
            ret[key] = attr;
         } else {
            if (!attr.data) continue;
            let newAttr = transformRestItem(attr.data);
            if (hasId) {
               ret[key] = newAttr;
            } else {
               if (newAttr.url && Object.keys(newAttr).length == 1) {
                  ret[key] = newAttr.url;
               } else {
                  ret[key] = newAttr;
               }
            }
         }
      }
      return ret;
   }
}
function isNull(v) {
   return v === undefined || v == null;
}
function isUnit(v) {
   return ["string", "number", "boolean"].includes(typeof v);
}
