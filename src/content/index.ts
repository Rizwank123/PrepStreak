import { registerContent } from '../services/content/ContentLoader';
import type { TopicContent } from './types';

// DSA
import {
  arraysContent, twoPointerContent, slidingWindowContent, binarySearchContent,
  stringsContent, hashingContent, linkedListContent, stackContent, queueContent,
  heapContent, priorityQueueContent, treeContent, bstContent, graphContent,
  dfsContent, bfsContent, dynamicProgrammingContent, backtrackingContent,
  greedyContent, sortingContent, searchingContent, prefixSumContent, trieContent,
  unionFindContent, topologicalSortContent, shortestPathContent, bitManipulationContent,
  mathContent, recursionContent, monotonicStackContent, segmentTreeContent, fenwickTreeContent,
} from './dsa';

// System Design
import {
  capTheoremContent, scalabilityContent, loadBalancerContent, cachingContent, microservicesContent,
  rateLimiterContent, kafkaContent, distributedSystemsContent,
  redisContent, nginxContent, apiGatewayContent,
  databaseReplicationContent, shardingContent, partitioningContent, cqrsContent,
} from './system-design';

// Golang
import {
  goroutinesContent, channelsContent, contextContent, concurrencyContent,
  interfacesContent, errorHandlingContent, restApiContent, testingContent,
  cleanArchitectureContent, grpcContent,
} from './golang';

// Interview
import {
  behavioralContent, codingInterviewsContent, systemDesignInterviewContent,
  salaryNegotiationContent, golangInterviewContent,
} from './interview';

// AWS
import { iamContent, ec2Content, s3Content, lambdaContent, rdsContent } from './aws';

const ALL_CONTENT: TopicContent[] = [
  // DSA
  arraysContent, twoPointerContent, slidingWindowContent, binarySearchContent,
  stringsContent, hashingContent, linkedListContent, stackContent, queueContent,
  heapContent, priorityQueueContent, treeContent, bstContent, graphContent,
  dfsContent, bfsContent, dynamicProgrammingContent, backtrackingContent,
  greedyContent, sortingContent, searchingContent, prefixSumContent, trieContent,
  unionFindContent, topologicalSortContent, shortestPathContent, bitManipulationContent,
  mathContent, recursionContent, monotonicStackContent, segmentTreeContent, fenwickTreeContent,
  // System Design
  capTheoremContent, scalabilityContent, loadBalancerContent, cachingContent, microservicesContent,
  rateLimiterContent, kafkaContent, distributedSystemsContent,
  redisContent, nginxContent, apiGatewayContent,
  databaseReplicationContent, shardingContent, partitioningContent, cqrsContent,
  // Golang
  goroutinesContent, channelsContent, contextContent, concurrencyContent,
  interfacesContent, errorHandlingContent, restApiContent, testingContent,
  cleanArchitectureContent, grpcContent,
  // Interview
  behavioralContent, codingInterviewsContent, systemDesignInterviewContent,
  salaryNegotiationContent, golangInterviewContent,
  // AWS
  iamContent, ec2Content, s3Content, lambdaContent, rdsContent,
];

export function registerAllContent(): void {
  for (const topic of ALL_CONTENT) {
    registerContent(topic.slug, async () => topic);
  }
}
