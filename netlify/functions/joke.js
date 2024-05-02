// Jokes provided from the lovely folks at https://icanhazdadjoke.com
import jokes from './jokes.json';

/**
 * 每当客户端向生成的端点提出请求时将被调用的函数
 * 部署后，访问 https://<site base url>/.netlify/functions/joke 会看到 response
 * 在 netlify.toml 中的 [functions] 下 builder 配置，可支持 import jokes.json 和 export handler
 */
export const handler = async (event) => {
    // Generates a random index based on the length of the jokes array
    const randomIndex = Math.floor(Math.random() * jokes.length)
    const randomJoke = jokes[randomIndex]
    
    // Netlify Functions need to return an object with a statusCode
    // Other properties such as headers or body can also be included.
    return {
        statusCode: 200,
        body: JSON.stringify(randomJoke)
    }
}
