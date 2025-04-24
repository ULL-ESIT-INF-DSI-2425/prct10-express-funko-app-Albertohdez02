import request from "request";

type myFilter = {
  name?: string,
  gender?: string,
  race?: string,
  affiliation?: string
}

export function findCharacter(filter: myFilter): Promise<request.Response> {
  let url: string = `https://dragonball-api.com/api/characters?`

  for (const myKey in filter) {
    url += myKey + "=" + filter[myKey as keyof myFilter] + "&";
  }

  return new Promise<request.Response>((resolve, reject) => {
    request({url: url, json: true}, (error: Error, response: request.Response) => {
      if (error) {
        reject("Error: petition could not be made")
      } else {
        if(response.body.length == 0) {
          reject("No characters found")
        } else {
          resolve(response);
        }
      }
    });
  });
};

// findCharacter({name: "goku"}).then((result) => {
//   console.log(result.body)
// })
