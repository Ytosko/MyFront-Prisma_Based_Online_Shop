import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.GEMINI_API_KEY || ""
const genAI = new GoogleGenerativeAI(apiKey)

export async function generateProductDescription(name: string) {
    if (!apiKey) return "API Key missing."
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" })
        const prompt = `Write a compelling product description for an online shop. Product Name: "${name}". Keep it concise (around 100 words), professional, and SEO friendly. Return only the description text.`

        const result = await model.generateContent(prompt)
        const response = await result.response
        return response.text()
    } catch (e: any) {
        console.error("Gemini Error:", e)
        return "Failed to generate description. " + e.message
    }
}
