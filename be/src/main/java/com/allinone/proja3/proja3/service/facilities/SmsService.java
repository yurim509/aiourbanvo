package com.allinone.proja3.proja3.service.facilities;

import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.exception.NurigoMessageNotReceivedException;
import net.nurigo.sdk.message.service.DefaultMessageService;
import net.nurigo.sdk.message.model.Message;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SmsService {
    private final DefaultMessageService messageService;

    public SmsService(
            @Value("${coolsms.apiKey}") String apiKey,
            @Value("${coolsms.apiSecret}") String apiSecret) {
        this.messageService = NurigoApp.INSTANCE.initialize(apiKey,apiSecret, "https://api.coolsms.co.kr");        System.out.println("message service:  000) " + this.messageService);
        System.out.println("message service: " + this.messageService);
//        System.out.println("apiKey:"+apiKey +",apiSecret:"+apiSecret);
    }

    public boolean sendConfirmationMessage(String to, String text) {
        System.out.println("this is sendConfirmationMessage call : 111)");
        Message message = new Message();
        message.setFrom("01075473869"); // 계정에서 등록된 발신 번호
        message.setTo(to); // 수신 번호
        message.setText(text); // 전송할 문자 내용

        System.out.println("message:"+message );
        try {
            System.out.println("777)");
            // 메시지를 전송합니다.
            messageService.send(message);
            System.out.println("888)");
            System.out.println("Message sent successfully");
            return true;

        } catch (NurigoMessageNotReceivedException exception) {
            System.out.println("Failed messages: " + exception.getFailedMessageList());
            System.out.println("Error message: " + exception.getMessage());
//            System.out.println("Failed messages: " + exception.getFailedMessageList());
//            System.out.println(exception.getMessage());
        } catch (Exception exception) {
            System.out.println("Failed to send message: " + exception.getMessage());
        }
        return false;

    }

}
