using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Movement : MonoBehaviour
{
    public float moveSpeed;
    public int ownerId;
    public Text nickname;

    // Start is called before the first frame update
    void Start()
    {
        GetComponentInChildren<Canvas>().worldCamera = Camera.main;
        if (WebsocketClient.GetInstance().clientId == ownerId)
            Camera.main.GetComponent<CameraScripts>().player = transform;
        InvokeRepeating("SendTargetToServer", 0, 0.5f);
    }

    // Update is called once per frame
    void Update()
    {
        //if (WebsocketClient.GetInstance().clientId != ownerId) return;
        //Vector3 target = Camera.main.ScreenToWorldPoint(Input.mousePosition);
        Vector3 target = CheckTarget();
        target.z = transform.position.z;

        transform.position = Vector3.MoveTowards(transform.position, target, moveSpeed * Time.deltaTime);
    }

    void SendTargetToServer()
    {
        if (WebsocketClient.GetInstance().clientId != ownerId) return;
        WebsocketClient.GetInstance().SendUpdate(Camera.main.ScreenToWorldPoint(Input.mousePosition));
        Debug.Log("SendTargetToServer");
    }

    Vector3 CheckTarget()
    {
        float x = WebsocketClient.GetInstance().playerPool[ownerId].targetX;
        float y = WebsocketClient.GetInstance().playerPool[ownerId].targetY;
        
        return new Vector3(x, y, 0);
    }


}
