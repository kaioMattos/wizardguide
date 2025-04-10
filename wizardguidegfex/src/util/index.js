const _assembleFilterGeneric = (propFilter, value) => (` ${propFilter} eq '${value}'`);
const assembleOrFilterGeneric =  (objHana, propOfilter, propObjHana) => {
  const aValues = objHana[propObjHana].filter((item)=>(item.status));
  console.log(aValues)
  const aFiltersValues = aValues.map((item)=>(` ${propOfilter} eq '${item[propOfilter]}' or`));
  return aFiltersValues.join('').slice(0, -3);
};

const removeDuplicatesFromArray = (arr)=>{
  return [...new Set(
      arr.map(el => JSON.stringify(el))
  )].map(e => JSON.parse(e))
}

const readFile = (file)=>{
  return new Promise((resolve, reject) => {
    var fr = new FileReader();  
    fr.onload = () => {
      resolve(fr.result)
    };
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}

const getDateNowFrontFormated = () => {
  const oDate = new Date();
  const year = oDate.getFullYear();
  const month = (oDate.getMonth()+1) <= 9 ? `0${oDate.getMonth()+1}` : (oDate.getMonth()+1);
  const day = oDate.getDate() <= 9 ? `0${oDate.getDate()}` : oDate.getDate();
  const hours = oDate.getHours() <= 9 ? `0${oDate.getHours()}` : oDate.getHours();
  const minutes = oDate.getMinutes() <= 9 ? `0${oDate.getMinutes()}` : oDate.getMinutes();
  return `${day}-${month}-${year} ${hours}:${minutes}`
}

export {assembleOrFilterGeneric, removeDuplicatesFromArray, readFile, getDateNowFrontFormated}