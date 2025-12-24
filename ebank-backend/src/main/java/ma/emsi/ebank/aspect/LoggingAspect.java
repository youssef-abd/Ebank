package ma.emsi.ebank.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect
@Component
@Slf4j
public class LoggingAspect {
    
    @Pointcut("execution(* ma.emsi.ebank.service.*.*(..))")
    public void serviceLayer() {}
    
    @Pointcut("execution(* ma.emsi.ebank.controller.*.*(..))")
    public void controllerLayer() {}
    
    @Before("serviceLayer() || controllerLayer()")
    public void logBefore(JoinPoint joinPoint) {
        log.info("==> Entering method: {} with arguments: {}",
                joinPoint.getSignature().toShortString(),
                Arrays.toString(joinPoint.getArgs()));
    }
    
    @AfterReturning(pointcut = "serviceLayer() || controllerLayer()", returning = "result")
    public void logAfterReturning(JoinPoint joinPoint, Object result) {
        log.info("<== Method {} returned: {}",
                joinPoint.getSignature().toShortString(),
                result != null ? result.getClass().getSimpleName() : "null");
    }
    
    @AfterThrowing(pointcut = "serviceLayer() || controllerLayer()", throwing = "exception")
    public void logAfterThrowing(JoinPoint joinPoint, Throwable exception) {
        log.error("<!> Exception in method {}: {}",
                joinPoint.getSignature().toShortString(),
                exception.getMessage());
    }
    
    @Around("serviceLayer()")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        
        Object result = joinPoint.proceed();
        
        long executionTime = System.currentTimeMillis() - startTime;
        log.info("Method {} executed in {} ms",
                joinPoint.getSignature().toShortString(),
                executionTime);
        
        return result;
    }
}
