import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;

public class WarehouseAgents {

    // ==========================================
    // 1. Senior Technical Architect Interface
    // ==========================================
    interface SeniorTechnicalArchitect {
        @SystemMessage({
            "You are a Senior Technical Architect who understands technologies end-to-end.",
            "You excel at choosing the right tech stack, designing databases, API structures, ",
            "and ensuring systems are secure, scalable, and maintainable.",
            "Your goal is to design scalable, robust, and efficient system architectures for a warehouse management system."
        })
        String designArchitecture(@UserMessage String requirements);
    }

    // ==========================================
    // 2. Lead Full Stack Software Engineer Interface
    // ==========================================
    interface FullStackEngineer {
        @SystemMessage({
            "You are a Lead Full Stack Software Engineer with extensive experience in both front-end ",
            "(e.g., React, Vue) and back-end (e.g., Python, Node.js, Java) development.",
            "Your goal is to implement the system architecture by writing clean, maintainable code.",
            "You take architectural designs and turn them into highly functional applications."
        })
        String developSystem(@UserMessage String architectureDocument);
    }

    // ==========================================
    // 3. Lead Test Engineer Interface
    // ==========================================
    interface TestEngineer {
        @SystemMessage({
            "You are a meticulous Lead Test Engineer. You think outside the box to find edge cases ",
            "and design comprehensive end-to-end testing scenarios.",
            "Your job is to ensure the warehouse management system is flawlessly tested from the UI down to the database."
        })
        String createTestPlan(@UserMessage String codebaseAndArchitecture);
    }

    public static void main(String[] args) {
        System.out.println("Starting the Multi-Agent Setup for the Warehouse Management System in Java...\n");

        // 1. Initialize the AI Model (Requires OPENAI_API_KEY environment variable)
        // Note: For this to run, set your API key below or via environment variable.
        String apiKey = System.getenv("OPENAI_API_KEY");
        if (apiKey == null || apiKey.isEmpty()) {
            System.err.println("WARNING: OPENAI_API_KEY environment variable is not set. The API calls will fail.");
            apiKey = "demo"; // Fallback, will likely fail if making real requests
        }

        ChatLanguageModel model = OpenAiChatModel.builder()
                .apiKey(apiKey)
                .modelName("gpt-4o") // Or gpt-3.5-turbo
                .build();

        // 2. Instantiate the Agents using LangChain4j AiServices
        SeniorTechnicalArchitect architect = AiServices.create(SeniorTechnicalArchitect.class, model);
        FullStackEngineer fullStackEngineer = AiServices.create(FullStackEngineer.class, model);
        TestEngineer testEngineer = AiServices.create(TestEngineer.class, model);

        // 3. Define the initial requirements (The "Task")
        String requirements = "We need a modern Warehouse Management System (WMS) that handles real-time inventory tracking, user roles (admin, worker), and order fulfillment.";

        System.out.println("==========================================");
        System.out.println("STEP 1: Architect designing the system...");
        System.out.println("==========================================");
        
        try {
            // Un-comment these lines to actually execute the LLM workflow:
            
            /*
            String architectureDoc = architect.designArchitecture(requirements);
            System.out.println(architectureDoc);

            System.out.println("\n==========================================");
            System.out.println("STEP 2: Full Stack Engineer writing code...");
            System.out.println("==========================================");
            String codeBase = fullStackEngineer.developSystem("Based on this architecture, generate the core APIs and project structure: " + architectureDoc);
            System.out.println(codeBase);

            System.out.println("\n==========================================");
            System.out.println("STEP 3: Test Engineer creating End-to-End Tests...");
            System.out.println("==========================================");
            String testPlan = testEngineer.createTestPlan("Review this architecture and code, and write an E2E test plan:\n\nArchitecture:\n" + architectureDoc + "\n\nCode:\n" + codeBase);
            System.out.println(testPlan);
            */
           
           System.out.println("Agents successfully instantiated! (Uncomment the execution block in main() to run them).");

        } catch (Exception e) {
            System.err.println("Error running agents: " + e.getMessage());
        }
    }
}
