package com.allinone.proja3.proja3.repository;

import com.allinone.proja3.proja3.model.community.Chat;
import com.allinone.proja3.proja3.model.community.Market;
import com.allinone.proja3.proja3.repository.community.CommunityChatRepository;
import com.allinone.proja3.proja3.repository.community.CommunityMarketRepository;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@SpringBootTest
//@Transactional
public class ChatRepositoryTestg {

    @Autowired
    private CommunityChatRepository repository;

    @Autowired
    private CommunityMarketRepository marketRepository;


//
//    @Transactional
//    @Test
//    public void tt() {
//        // Assuming you have a market repository to fetch the Market entity
//        Market market = marketRepository.findById(1L).orElse(null);
//        // Check if the market exists
//        assertThat(market).isNotNull(); // Ensure market is not null
//        System.out.println("market:" +market);
//        // Now test fetching chats
//        List<Chat> result = repository.findByMarketAndSenderIdAndReceiverId(market, 1L, 1L);
//        System.out.println("Result: " +result.size());
//        // You can assert or print the results
//        result.forEach(System.out::println); // Print the results
//    }

}
